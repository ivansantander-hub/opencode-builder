import { createSignal, type Component } from "solid-js"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAuth } from "../../contexts/auth"
import { useI18n } from "../../i18n"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export const RegisterForm: Component<RegisterFormProps> = (props) => {
  const { register } = useAuth()
  const { t } = useI18n()
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [confirmPassword, setConfirmPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password() !== confirmPassword()) {
      setError(t("auth.passwordsDoNotMatch"))
      setLoading(false)
      return
    }

    const result = await register(email(), password(), confirmPassword())

    setLoading(false)
    if (!result.success) {
      setError(result.error || t("auth.registerError"))
    }
  }

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
      <Card class="w-full max-w-md p-8">
        <h1 class="text-2xl font-bold text-center mb-6">{t("auth.register")}</h1>
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{t("auth.confirmPassword")}</label>
            <Input
              type="password"
              value={confirmPassword()}
              onChange={setConfirmPassword}
              placeholder={t("auth.passwordPlaceholder")}
            />
          </div>
          {error() && <p class="text-sm text-red-600">{error()}</p>}
          <Button type="submit" class="w-full" disabled={loading()}>
            {loading() ? t("common.loading") : t("auth.registerButton")}
          </Button>
          <p class="text-sm text-center text-gray-600">
            {t("auth.alreadyHaveAccount")}{" "}
            <button type="button" class="text-blue-600 hover:underline" onClick={props.onSwitchToLogin}>
              {t("auth.login")}
            </button>
          </p>
        </form>
      </Card>
    </div>
  )
}
