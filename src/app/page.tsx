import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the login page initially
  redirect('/login');
  // Return null or an empty fragment because redirect throws an error and stops rendering
  return null;
}
