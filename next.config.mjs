const routes = ['portfolio', 'planner', 'contact', 'blog', 'team', 'templates', 'second-boot', 'admin', 'admin-auth', 'article'];
export default {
    outputFileTracingIncludes: { '/*': ['./legacy/pages/*.html', './legacy/*.css'] },
    async redirects() {
        return [
            { source: '/index.html', destination: '/', permanent: true },
            ...routes.map(route => ({ source: `/${route}.html`, destination: `/${route}`, permanent: true }))
        ];
    }
};
