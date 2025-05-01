import React from "react";
import { Link, NavigationContext } from "@django-bridge/react";

interface HomeViewProps {
  navigation_test_url: string;
}

export default function HomeView({ navigation_test_url }: HomeViewProps) {
  const { navigate } = React.useContext(NavigationContext);

  return (
    <>
      <h1>Django Bridge tests</h1>
      <h2>Navigation</h2>
      <ul>
        <li>
          <Link href={navigation_test_url}>
            Navigate with &lt;Link&gt; component
          </Link>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(navigation_test_url);
            }}
          >
            Navigate with navigate() function
          </a>
        </li>
        <li>
          <Link href={`${navigation_test_url}?delay=true`}>
            Navigate to a very slow view (5 second delay)
          </Link>
        </li>
        <li>
          <Link href={`${navigation_test_url}?raise_exception=true`}>
            Navigate to a view that raises an exception
          </Link>
        </li>
        <li>
          <Link href={`${navigation_test_url}?no_component=true`}>
            Navigate to a view that doesn't have a component
          </Link>
        </li>
      </ul>
    </>
  );
}
