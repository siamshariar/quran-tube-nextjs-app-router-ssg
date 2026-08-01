"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Meta from "../core/Meta";
import {server} from "../../lib/config";

export default function OfflineContent() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      router.replace("/");
    }
  }, [isOnline, router]);

  if (isOnline) {
    return null;
  }

    return (
        <>
            <Meta
                title="Quran Tube"
                description="Discover the beauty of Quran recitations through videos with Quran.tube"
                url={server}
                image={`${server}/img/logo/default_share.png`}
                type="website"
            />
              <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-4" style={{fontSize: `1.5rem`, fontWeight: `400`}}>No Internet Connection!</h1>
                <p className="text-lg text-center mb-6">
                  Kindly connect to the internet and refresh the pages. Once completed, you can access the content offline.
                </p>
              </div>
        </>
    );
}
