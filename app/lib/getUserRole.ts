export default async function getUserRole(address: string){
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    try{
        const response = await fetch(`${BASE_URL}/api/users/getUserRole/${address}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error('Failed to load user role:', response);
            return null;
          }
    } catch(error){
        console.error(error);
        return null;
    }
}