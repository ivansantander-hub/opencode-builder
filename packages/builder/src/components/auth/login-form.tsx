import { createSignal, type Component } from "solid-js"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAuth } from "../../contexts/auth"
import { useI18n } from "../../i18n"

interface LoginFormProps {
  onSwitchToRegister?: () => void
}

export const LoginForm: Component<LoginFormProps> = (props) => {
  const { login } = useAuth()
  const { t } = useI18n()
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [error, setError] = createSignal(false)
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    const success = await login(email(), password())

    setLoading(false)
    if (!success) {
      setError(true)
    }
  }

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
      <Card class="w-full max-w-md p-8">
        <h1 class="text-2xl font-bold text-center mb-6">{t("auth.login")}</h1>
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{t("auth.email")}</label>
            <Input type="email" value={email()} onChange={setEmail} placeholder={t("auth.emailPlaceholder")} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{t("auth.password")}</label>
            <Input
              type="password"
              value={password()}
              onChange={setPassword}
              placeholder={t("auth.passwordPlaceholder")}
            />
          </div>
          {error() && <p class="text-sm text-red-600">{t("auth.loginError")}</p>}
          <Button type="submit" class="w-full" disabled={loading()}>
            {loading() ? t("common.loading") : t("auth.loginButton")}
          </Button>
          <p class="text-sm text-center text-gray-600">
            {t("auth.dontHaveAccount")}{" "}
            <button type="button" class="text-blue-600 hover:underline" onClick={props.onSwitchToRegister}>
              {t("auth.register")}
            </button>
          </p>
        </form>
      </Card>
    </div>
  )
}
