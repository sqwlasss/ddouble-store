import { useState, useEffect } from "react";
import { useAccount } from "@/lib/AccountContext";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Phone, Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { customer, updateProfile, loading, hasShopifyAccount } = useAccount();
  const { user: base44User } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName || "");
      setLastName(customer.lastName || "");
      setPhone(customer.phone || "");
    }
  }, [customer]);

  if (!hasShopifyAccount) {
    return (
      <div className="text-center py-16">
        <User size={40} className="mx-auto text-[#D9D2C5] mb-4" />
        <h2 className="text-xl font-light text-[#1A1A1A] mb-2">No Shopify account linked</h2>
        <p className="text-sm text-[#6B6B67] mb-6 max-w-sm mx-auto">
          Link your account to manage your profile, orders, and addresses.
        </p>
        <Button onClick={() => navigate("/account/settings")} variant="outline">
          Link Account
        </Button>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ firstName, lastName, phone });
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-[#1A1A1A] mb-6">Profile</h2>

      <form onSubmit={handleSave} className="space-y-6 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B67]" />
            <Input
              id="email"
              value={customer?.email || base44User?.email || ""}
              disabled
              className="pl-10 h-11 bg-[#F1F0EC]"
            />
          </div>
          <p className="text-[11px] text-[#6B6B67]">Email cannot be changed.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B67]" />
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pl-10 h-11"
                placeholder="First name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11"
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B67]" />
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 h-11"
              placeholder="+373 123 456 789"
            />
          </div>
        </div>

        <Button type="submit" disabled={saving || loading} className="h-11 px-6">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
