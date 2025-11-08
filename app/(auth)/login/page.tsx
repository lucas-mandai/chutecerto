import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Chute Certo</h1>
          <p className="text-muted-foreground">Jogo de perguntas e respostas em equipe</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
