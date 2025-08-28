import { Link } from "@django-bridge/react";

interface NavigationViewProps {
  home_url: string;
}

export default function NavigationView({ home_url }: NavigationViewProps) {
  return (
    <>
      <h1>Django Bridge tests</h1>
      <h2>Navigation test complete</h2>
      <p>
        <Link href={home_url}>Go back</Link>
      </p>
    </>
  );
}
