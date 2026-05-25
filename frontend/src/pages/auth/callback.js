export default function AuthCallback() {
    return null;
}

export async function getServerSideProps({ query, res }) {
    const { token } = query;

    if (token) {
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Path=/`);
    }

    return {
        redirect: {
            destination: '/',
            permanent: false,
        }
    };
}
