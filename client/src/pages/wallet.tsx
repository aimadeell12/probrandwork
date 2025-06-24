
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Wallet() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">محفظتي</h1>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-lg">الرصيد الحالي</p>
            <p className="text-3xl font-bold">0.00</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
