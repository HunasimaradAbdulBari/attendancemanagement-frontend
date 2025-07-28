import LoginForm from '../../components/Auth/LoginForm';

export default function TeacherLogin() {
  return (
    <LoginForm 
      userType="teacher" 
      title="Teacher"
    />
  );
}