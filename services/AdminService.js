class AdminService {
    constructor(db) {
        this.Admin = db.Admin;
    }

    async ensureDefaultAdmin() {
        const existingAdmin = await this.Admin.finOne({
            where: { username: 'admin' }
        });

        if(!existingAdmin) {
            await this.Admin.create({
                username: 'admin',
                password: 'P4ssword'
            });
        }
    }

    async validateCredentials(username, password) {

    }
}

module.exports = AdminService;