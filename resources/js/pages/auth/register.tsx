import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { GraduationCap } from 'lucide-react';


export default function Register() {
    return (
        <>
            <Head title="Register" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Multi-SchoolHub
                                </span>
                            </Link>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">Already have an account?</span>
                                <Link
                                    href={login()}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                                >
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        {/* Register Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Create an Account
                                </h1>
                                <p className="text-gray-600">
                                    Enter your details below to get started
                                </p>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password', 'password_confirmation']}
                                disableWhileProcessing
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-gray-700 font-medium">
                                                    Full Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    className="h-11"
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    name="email"
                                                    placeholder="email@example.com"
                                                    className="h-11"
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-gray-700 font-medium">
                                                    Password
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="••••••••"
                                                    className="h-11"
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation" className="text-gray-700 font-medium">
                                                    Confirm Password
                                                </Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="••••••••"
                                                    className="h-11"
                                                />
                                                <InputError message={errors.password_confirmation} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="school_name" className="text-gray-700 font-medium">
                                                    School Name
                                                </Label>
                                                <Input
                                                    id="school_name"
                                                    type="text"
                                                    required
                                                    tabIndex={5}
                                                    name="school_name"
                                                    placeholder="Enter your school name"
                                                    className="h-11"
                                                />
                                                <InputError message={errors.school_name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address" className="text-gray-700 font-medium">
                                                    School Address (Optional)
                                                </Label>
                                                <Input
                                                    id="address"
                                                    type="text"
                                                    tabIndex={6}
                                                    name="address"
                                                    placeholder="Enter your school address"
                                                    className="h-11"
                                                />
                                                <InputError message={errors.address} />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all"
                                            tabIndex={7}
                                            disabled={processing}
                                            data-test="register-user-button"
                                        >
                                            {processing && <Spinner />}
                                            Create Account
                                        </Button>

                                        <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                                            Already have an account?{' '}
                                            <TextLink href={login()} tabIndex={8} className="text-blue-600 hover:text-blue-700 font-medium">
                                                Log in
                                            </TextLink>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>

                        {/* Footer Note */}
                        <p className="text-center text-sm text-gray-500 mt-6">
                            By signing up, you agree to our Terms of Service
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}