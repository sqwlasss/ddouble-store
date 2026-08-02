import { LogOut, User } from "lucide-react";
import { useAccount } from "@/lib/AccountContext";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const { customer } = useAccount();
  const { logout, user } = useAuth();

  return (
    <div>
      <h2 className="text-lg font-medium text-[#1A1A1A] mb-6">Account settings</h2>

      <div className="space-y-10 max-w-lg">
        <section>
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56] mb-4 flex items-center gap-1.5">
            <User size={12} />
            Account
          </h3>
          <div className="border border-[#E5E5E1] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                {(customer?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {customer?.firstName ? `${customer.firstName} ${customer.lastName || ""}`.trim() : "You"}
                </p>
                <p className="text-xs text-[#6B6B67]">{customer?.email || user?.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#E5E5E1] pt-8">
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A56] mb-4">Account actions</h3>
          <Button
            onClick={() => logout()}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut size={14} className="mr-1" />
            Log out
          </Button>
        </section>
      </div>
    </div>
  );
}
