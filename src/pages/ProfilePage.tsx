import { UserProfile } from "@clerk/clerk-react";
import PageHeader from "@/components/layout/PageHeader";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="My Profile"
                description="Manage your account settings and preferences"
                onTitleChange={() => { }}
                onDescriptionChange={() => { }}
            />
            <div className="flex justify-center">
                <UserProfile routing="path" path="/profile" />
            </div>
        </div>
    );
}
