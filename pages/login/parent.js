import LoginForm from '../../components/Auth/LoginForm';

export default function ParentLogin() {
  return (
    <LoginForm 
      userType="parent" 
      title="Parent"
    />
  );
}