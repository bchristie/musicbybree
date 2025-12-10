import { AdminArtistDetail } from "@/components/AdminArtistDetail";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewArtistPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/artists">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Artists
          </Button>
        </Link>
      </div>

      <AdminArtistDetail />
    </div>
  );
}
