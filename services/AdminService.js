class AdminService {
    constructor(db) {
        this.Admin = db.Admin;
    }

    async ensureDefaultAdmin() {
        const existingAdmin = await this.Admin.findOne({
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
        const admin = await this.Admin.findOne({
            where: { username: 'admin' }
        });

        if (!admin) {
            return false;
        }

        if (admin.password !== password) {
            return false;
        }

        return true;
    }
}

module.exports = AdminService;