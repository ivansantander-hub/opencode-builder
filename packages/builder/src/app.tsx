import { MetaProvider, Title } from "@solidjs/meta"
import { Router, Route } from "@solidjs/router"
import { AuthProvider } from "./contexts/auth"
import { I18nProvider } from "./i18n"
import { lazy } from "solid-js"

const Dashboard = lazy(() => import("./routes/index"))

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>OpenCode Builder</Title>
          <AuthProvider>
            <I18nProvider>
              <div style={{ "min-height": "100vh", background: "#f9fafb" }}>{props.children}</div>
            </I18nProvider>
          </AuthProvider>
        </MetaProvider>
      )}
    >
      <Route path="/" component={Dashboard} />
    </Router>
  )
}
