const links = {
    client: { // all users
        home: "/",
        auth: "/auth",
        product: "/product/:id",
    },
    panel: { // only for authenticated users
        home: "/panel",
        profile: "/panel/profile",
        users: "/panel/users", // only for admin
        productManagement: "/panel/products", // only for admin
    },
}

export default links;
