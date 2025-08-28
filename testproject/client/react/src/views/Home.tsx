import React from "react";
import { Link, NavigationContext } from "@django-bridge/react";

interface HomeViewProps {
  time: Date;
  navigation_test_url: string;
}

export default function HomeView({ time, navigation_test_url }: HomeViewProps) {
  const { navigate, refreshProps, replacePath, frameId, path, isNavigating } =
    React.useContext(NavigationContext);

  return (
    <>
      <h1>Django Bridge tests</h1>
      <p>Frame ID: {frameId}</p>
      <p>Path: {path}</p>
      <p>Is navigating: {isNavigating ? "true" : "false"}</p>
      <p>The time is: {time.toLocaleString()}</p>
      <h2>Utilities</h2>
      <ul>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              refreshProps();
            }}
          >
            Refresh props from server
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              replacePath(frameId, "/?test=replace_path");
            }}
          >
            Modify query params, without reloading the page
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              replacePath(frameId, "/replace_path");
            }}
          >
            Replace the path, without reloading the page
          </a>
        </li>
      </ul>
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
