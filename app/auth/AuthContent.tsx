"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Mail, Lock, User, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function AuthContent() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});

    const { signIn, signUp, user, loading } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const validateForm = () => {
        const newErrors: typeof errors = {};

        const emailResult = emailSchema.safeParse(email);
        if (!emailResult.success) {
            newErrors.email = emailResult.error.issues[0].message;
        }

        const passwordResult = passwordSchema.safeParse(password);
        if (!passwordResult.success) {
            newErrors.password = passwordResult.error.issues[0].message;
        }

        if (!isLogin && !fullName.trim()) {
            newErrors.fullName = 'Please enter your name';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        toast.error('Invalid email or password. Please try again.');
                    } else {
                        toast.error(error.message);
                    }
                    return;
                }
                toast.success('Welcome back!');
                router.push('/');
            } else {
                const { error } = await signUp(email, password, fullName);
                if (error) {
                    if (error.message.includes('already registered')) {
                        toast.error('This email is already registered. Please log in instead.');
                    } else {
                        toast.error(error.message);
                    }
                    return;
                }
                toast.success('Account created successfully! Welcome to PDFHubs.');
                router.push('/');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>

                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-md">
                            <FileText className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-heading text-xl font-bold text-foreground">
                            PDF<span className="text-primary">Tools</span>
                        </span>
                    </div>

                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        {isLogin
                            ? 'Sign in to access your conversion history and saved files.'
                            : 'Join thousands of users who trust PDFHubs for their document needs.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className={`pl-10 h-12 ${errors.fullName ? 'border-destructive' : ''}`}
                                        placeholder="John Doe"
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-sm text-destructive">{errors.fullName}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`pl-10 h-12 ${errors.email ? 'border-destructive' : ''}`}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`pl-10 pr-10 h-12 ${errors.password ? 'border-destructive' : ''}`}
                                    placeholder="••••••••"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium shadow-md"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setErrors({});
                            }}
                            className="font-medium text-primary hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Right side - Decorative */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-hero">
                <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-primary-foreground">
                        <div className="text-8xl mb-8">📄</div>
                        <h3 className="font-heading text-3xl font-bold mb-4">
                            Your PDF toolkit, always ready
                        </h3>
                        <p className="text-lg opacity-90 max-w-md">
                            Convert, edit, and manage your PDFs with powerful cloud-based tools.
                            Save your work and access it from anywhere.
                        </p>
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-20 left-20 w-20 h-20 bg-primary-foreground/10 rounded-2xl rotate-12 animate-float" />
                <div className="absolute bottom-32 right-20 w-16 h-16 bg-primary-foreground/10 rounded-full animate-float-slow" />
                <div className="absolute top-1/3 right-32 w-12 h-12 bg-primary-foreground/10 rounded-lg -rotate-12 animate-float" style={{ animationDelay: '1s' }} />
            </div>
        </div>
    );
}
