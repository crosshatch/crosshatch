export default {
    async fetch(request, env) {
        return new Response("Not Found", { status: 404 });
    },
};