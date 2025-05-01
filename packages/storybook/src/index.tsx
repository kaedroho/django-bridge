import React from "react";
import { linkTo, hrefTo } from "@storybook/addon-links";
import LinkTo from "@storybook/addon-links/react";

import {
  BuildLinkElement,
  buildLinkElement as originalBuildLinkElement,
  Navigation,
  NavigationContext,
} from "@django-bridge/react";

// Generates a URL that will directly link to another component
// Note, the URL must be used in a <Link> component in order for this to work
export const componentUrl = (title: string, name?: string) =>
  name ? `component://${title}#${name}` : `component://${title}`;

function buildLinkElement(
  { children, ...props }: React.HTMLProps<HTMLAnchorElement>,
  navigation: Navigation,
  ref:
    | ((instance: HTMLAnchorElement | null) => void)
    | React.MutableRefObject<HTMLAnchorElement | null>
    | null
) {
  // Override the Link element to use storybook's LinkTo element instead to allow browsing
  if (props.href && props.href?.startsWith("component://")) {
    const split = props.href.slice(12).split("#", 2);
    return (
      // Workaround https://github.com/storybookjs/storybook/issues/14539
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <LinkTo ref={ref} kind={split[0]} story={split[1]}>
        {children}
      </LinkTo>
    );
  }

  return originalBuildLinkElement({ children, ...props }, navigation, ref);
}

export function OverrideLinks({
  children,
}: React.PropsWithChildren<Record<string, never>>): React.ReactElement {
  const navigate = (link: string) => {
    if (link.startsWith("component://")) {
      const split = link.slice(12).split("#", 2);
      // eslint-disable-next-line no-void
      void hrefTo(split[0], split[1]).then((href) => {
        window.location.href = href;
      });
      linkTo(split[0], split[1]);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        "navigate() can only be used in storybook with a componentUrl"
      );
    }

    return Promise.resolve();
  };

  const navigation: Navigation = React.useMemo(
    () => ({
      frameId: 0,
      path: "/",
      props: {},
      context: {},
      navigate,
      replacePath: () => {},
      submitForm: navigate,
      openOverlay: navigate,
      refreshProps: () => Promise.resolve(),
      isNavigating: false,
    }),
    []
  );

  return (
    <NavigationContext.Provider value={navigation}>
      <BuildLinkElement.Provider value={buildLinkElement}>
        {children}
      </BuildLinkElement.Provider>
    </NavigationContext.Provider>
  );
}
