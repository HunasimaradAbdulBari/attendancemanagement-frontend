import LoginForm from '../../components/Auth/LoginForm';

export default function AdminLogin() {
  return (
    <LoginForm 
      userType="admin" 
      title="Admin"
      defaultCredentials={{
        email: "admin@presidencyuniversity.in",
        password: "admin@123"
      }}
    />
  );
}