import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark gradient overlay for better contrast */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

            <div className="z-10 animate-fade-in-up">
                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
            </div>
        </div>
    );
}
