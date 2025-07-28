import LoginForm from '../../components/Auth/LoginForm';

export default function StudentLogin() {
  return (
    <LoginForm 
      userType="student" 
      title="Student"
    />
  );
}