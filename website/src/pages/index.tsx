import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Logo from "@site/static/img/django-bridge-text.svg";
import ReactLogo from "@site/static/img/react-logo-white.svg";
import CodeBlock from "@theme/CodeBlock";

import styles from "./index.module.css";
import Link from "@docusaurus/Link";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {<Logo width={400} />}
          <span className={styles.visuallyhidden}>Django Bridge</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          The modern way to build <b>Django</b> and{" "}
          <b style={{ whiteSpace: "nowrap" }}>
            <ReactLogo
              style={{
                display: "inline",
                width: "1em",
                height: "0.9em",
                paddingTop: "0.1em",
              }}
            />
            React single-page apps
          </b>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction"
          >
            Get started
          </Link>
          <a
            className="button button--secondary button--lg"
            href="https://demo.django-bridge.org"
            rel="nofollow"
          >
            Demo
          </a>
        </div>
        <HomepageFeatures />
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <h2>Build your application logic in Django</h2>
          <p>
            Build your backend like a regular Django app using Django views,
            forms and URL routing.
          </p>
          <CodeBlock language="python">{`from django_bridge import Response

def form(request):
    form = MyForm(request.POST or None)

    if form.is_valid():
        # Form submission logic here

    return Response(request, "FormView", {
        "action_url": reverse("form"),
        "form": form,
    })
  `}</CodeBlock>
          <p>
            You can put as much logic as you like into views, as it stays on the
            server it won't add bloat to your application and you also have
            direct access to the database.
          </p>
          <p>
            Most Django extensions work without changes (for example, you can
            use the amazing{" "}
            <a href="https://docs.allauth.org/en/latest/" rel="nofollow">
              Django allauth
            </a>{" "}
            extension to implement federated authentication).
          </p>
          <p>
            Instead of HTML, the views return JSON describing what the frontend
            should render. Anything JSON-serialisable can be returned. You can
            register <a href="/docs/python2react/">JavaScript adapters</a> to
            convert non-JSON serialisable objects, such as forms.
          </p>
        </section>
        <section className={styles.section}>
          <h2>Render the frontend with React</h2>
          <p>
            The JSON response from the server is fed into the props of a React
            component to render it.
          </p>
          <CodeBlock language="jsx">{`function FormView({ action_url, form }) {
    const { csrfToken } = useContext(CSRFTokenContext);

    return (
      <Layout>
        <h1>A Django form rendered with React</h1>

        <Form action={action_url} method="post">
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value={csrf_token} />

          {form.render()}

          <button type="submit">Submit</button>
        </Form>
      </Layout>
    );
  }`}</CodeBlock>
          <p>
            <a href="/docs/global_context/">Global context providers</a> can be
            created to make global data such as URLs, CSRF Tokens or info about
            the user available as React contexts.
          </p>
          <p>
            It's unopinionated about how you build your frontend, so you can use
            any React component library or styling framework that you like.
          </p>
          <p>Supports Vite.js, and Storybook. Next.js support coming soon!</p>
        </section>
      </main>
    </Layout>
  );
}
