import { useState } from "react";
import { Link2, Unlink, LogOut, AlertTriangle } from "lucide-react";
import { useAccount } from "@/lib/AccountContext";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function Settings() {
  const { hasShopifyAccount, signInToShopify, signOutOfShopify, customer } = useAccount();
  const { logout, user } = useAuth();

  const [shopifyEmail, setShopifyEmail] = useState("");
  const [shopifyPassword, setShopifyPassword] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState("");

  const handleLink = async (e) => {
    e.preventDefault();
    setLinkError("");
    setLinking(true);
    try {
      await signInToShopify(shopifyEmail, shopifyPassword);
      toast({ title: "Account linked", description: "Your Shopify account is now connected." });
      setShopifyEmail("");
      setShopifyPassword("");
    } catch (err) {
      setLinkError(err.message || "Failed to link account. Check your credentials.");
    } finally {
      setLinking(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-[#1A1A1A] mb-6">Account settings</h2>

      <div className="space-y-10 max-w-lg">
        {/* Shopify Account Link */}
        <section>
          <h3 className="text-sm font-medium text-[#1A1A1A] mb-1 flex items-center gap-2">
            <Link2 size={16} />
            Shopify Account
          </h3>
          <p className="text-xs text-[#6B6B67] mb-4">
            Link your Shopify account to manage orders, addresses, and sync your wishlist across devices.
          </p>

          {hasShopifyAccount ? (
            <div className="border border-[#E5E5E1] p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {(customer?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {customer?.firstName || "Shopify User"}
                  </p>
                  <p className="text-xs text-[#6B6B67]">{customer?.email || user?.email}</p>
                </div>
              </div>
              <Button
                onClick={() => { signOutOfShopify(); toast({ title: "Account unlinked" }); }}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Unlink size={14} className="mr-1" />
                Unlink account
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLink} className="space-y-4">
              {linkError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  {linkError}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="shopify-email">Shopify account email</Label>
                <Input
                  id="shopify-email"
                  type="email"
                  value={shopifyEmail}
                  onChange={(e) => setShopifyEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shopify-password">Password</Label>
                <Input
                  id="shopify-password"
                  type="password"
                  value={shopifyPassword}
                  onChange={(e) => setShopifyPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <Button type="submit" disabled={linking}>
                {linking ? "Linking..." : "Link account"}
              </Button>
            </form>
          )}
        </section>

        {/* Account Actions */}
        <section className="border-t border-[#E5E5E1] pt-8">
          <h3 className="text-sm font-medium text-[#1A1A1A] mb-4">Account actions</h3>
          <Button
            onClick={() => logout()}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut size={14} className="mr-1" />
            Log out of DDouble
          </Button>
        </section>
      </div>
    </div>
  );
}
