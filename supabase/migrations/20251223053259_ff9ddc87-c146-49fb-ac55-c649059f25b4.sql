-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create site_settings table for banners, SEO, etc.
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read site settings (for displaying banners, etc.)
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only admins can modify site settings
CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create email_campaigns table
CREATE TABLE public.email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_type TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email_campaigns
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- Only admins can manage email campaigns
CREATE POLICY "Admins can manage email campaigns" 
ON public.email_campaigns 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create email_subscriptions table to track user preferences
CREATE TABLE public.email_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    marketing_emails BOOLEAN NOT NULL DEFAULT true,
    product_updates BOOLEAN NOT NULL DEFAULT true,
    welcome_email_sent BOOLEAN NOT NULL DEFAULT false,
    last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email_subscriptions
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own subscription
CREATE POLICY "Users can view own subscription" 
ON public.email_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" 
ON public.email_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert subscriptions" 
ON public.email_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions" 
ON public.email_subscriptions 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create advertisements table
CREATE TABLE public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    placement TEXT NOT NULL DEFAULT 'banner',
    is_active BOOLEAN NOT NULL DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on advertisements
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Everyone can view active advertisements
CREATE POLICY "Anyone can view active ads" 
ON public.advertisements 
FOR SELECT 
USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

-- Admins can manage all advertisements
CREATE POLICY "Admins can manage all ads" 
ON public.advertisements 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create email_logs table to track sent emails
CREATE TABLE public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    email_type TEXT NOT NULL,
    campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'sent',
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own email logs
CREATE POLICY "Users can view own email logs" 
ON public.email_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all email logs
CREATE POLICY "Admins can view all email logs" 
ON public.email_logs 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating updated_at columns
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
BEFORE UPDATE ON public.email_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES 
('seo', '{"title": "PDFTools - Free Online PDF Editor & Converter", "description": "Transform your PDFs with ease. Merge, split, compress, convert and edit PDF files online for free.", "keywords": ["pdf", "converter", "editor", "merge", "split", "compress"]}'),
('hero_banner', '{"enabled": false, "title": "", "description": "", "cta_text": "", "cta_link": "", "background_color": "#ef4444"}'),
('announcement_bar', '{"enabled": false, "text": "", "link": "", "background_color": "#ef4444"}');

-- Create function to create email subscription on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.email_subscriptions (user_id, marketing_emails, product_updates, welcome_email_sent)
  VALUES (NEW.id, true, true, false);
  RETURN NEW;
END;
$$;

-- Create trigger for new user subscription
CREATE TRIGGER on_auth_user_created_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_subscription();