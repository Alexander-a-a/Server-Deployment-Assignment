class ParticipantService {
  constructor(db) {
    this.Participant = db.Participant;
    this.Work = db.Work;
    this.Home = db.Home;
  }

  async create(payload) {
    const participant = payload.participant;
    const work = payload.work;
    const home = payload.home;

    if (!participant) {
      const err = new Error("Participant is required!");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!work) {
      const err = new Error("Work is required!");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!home) {
      const err = new Error("Home is required!");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const { email, firstname, lastname, dob } = participant;
    const { companyname, salary, currency } = work;
    const { country, city } = home;

    // participant checks

    if (!email) {
      const err = new Error("Email is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const firstNameNorm = (firstname || "").trim();

    if (!firstNameNorm) {
      const err = new Error("Firstname is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const lastNameNorm = (lastname || "").trim();

    if (!lastNameNorm) {
      const err = new Error("Lastname is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!dob) {
      const err = new Error("Date of birth is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const emailNorm = (email || "").trim().toLowerCase();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(emailNorm)) {
      const err = new Error("Invalid email format");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dobRegex.test(dob)) {
      const err = new Error("DOB must be in YYYY-MM-DD format");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    // Work checks

    const companyNameNorm = (companyname || "").trim();

    if (!companyNameNorm) {
      const err = new Error("Companyname is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!salary) {
      const err = new Error("Salary is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const currencyNorm = (currency || "").trim();

    if (!currencyNorm) {
      const err = new Error("Currency is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const intSalary = Number(salary);

    if (
      Number.isNaN(intSalary) ||
      !Number.isInteger(intSalary) ||
      intSalary <= 0
    ) {
      const err = new Error("Salary must be a number and bigger than 0");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    // Home checks

    const countryNorm = (country || "").trim();

    if (!countryNorm) {
      const err = new Error("Country is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const cityNorm = (city || "").trim();

    if (!cityNorm) {
      const err = new Error("city is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const createdParticipant = await this.Participant.sequelize.transaction(
      async (t) => {
        const participantRow = await this.Participant.create(
          {
            email: emailNorm,
            firstname: firstNameNorm,
            lastname: lastNameNorm,
            dob: dob,
          },
          { transaction: t }
        );

        await this.Work.create(
          {
            companyname: companyNameNorm,
            salary: intSalary,
            currency: currencyNorm,
            ParticipantId: participantRow.id,
          },
          { transaction: t }
        );

        await this.Home.create(
          {
            country: countryNorm,
            city: cityNorm,
            ParticipantId: participantRow.id,
          },
          { transaction: t }
        );

        return participantRow;
      }
    );

    return createdParticipant;
  }

  async getAll() {
    const participants = await this.Participant.findAll({
      include: [{ model: this.Work }, { model: this.Home }],
    });
    return participants;
  }

  async getAllDetails() {
    const participants = await this.Participant.findAll({
      attributes: ["email", "firstname", "lastname"],
    });
    return participants;
  }

  async getDetailsByEmail(email) {
    const emailNorm = (email || "").trim().toLowerCase();

    const participant = await this.Participant.findOne({
      where: { email: emailNorm },
      attributes: ["firstname", "lastname", "dob"],
    });

    if (!participant) {
      const err = new Error("No participant found");
      err.httpStatus = 404;
      err.code = "APP_NOT_FOUND";
      throw err;
    }
    return participant;
  }

  async getWorkByEmail(email) {
    const emailNorm = (email || "").trim().toLowerCase();

    const participant = await this.Participant.findOne({
      where: { email: emailNorm },
      include: [
        { model: this.Work, attributes: ["companyname", "salary", "currency"] },
      ],
    });

    if (!participant) {
      const err = new Error("No participant found");
      err.httpStatus = 404;
      err.code = "APP_NOT_FOUND";
      throw err;
    }

    if (!participant.Work) {
      const err = new Error("No work details found");
      err.httpStatus = 404;
      err.code = "APP_NOT_FOUND";
      throw err;
    }

    return participant;
  }

  async getHomeByEmail(email) {
    const emailNorm = (email || "").trim().toLowerCase();

    const participant = await this.Participant.findOne({
      where: { email: emailNorm },
      include: [{ model: this.Home, attributes: ["country", "city"] }],
    });

    if (!participant) {
      const err = new Error("No participant found");
      err.httpStatus = 404;
      err.code = "APP_NOT_FOUND";
      throw err;
    }

    if (!participant.Home) {
      const err = new Error("No home details found");
      err.httpStatus = 404;
      err.code = "APP_NOT_FOUND";
      throw err;
    }

    return participant;
  }

  async updateByEmail(email, payload) {
    const urlEmailNorm = (email || "").trim().toLowerCase();

    if (!urlEmailNorm) {
      const err = new Error("Url email is required!");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!payload) {
      const err = new Error("Payload is required!");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const participant = payload.participant;
    const work = payload.work;
    const home = payload.home;

    if (!participant) {
      const err = new Error("Participant is required!");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!work) {
      const err = new Error("Work is required!");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!home) {
      const err = new Error("Home is required!");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const { email: bodyEmail, firstname, lastname, dob } = participant;
    const { companyname, salary, currency } = work;
    const { country, city } = home;

    // participant checks

    if (!bodyEmail) {
      const err = new Error("Email is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const firstNameNorm = (firstname || "").trim();

    if (!firstNameNorm) {
      const err = new Error("Firstname is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const lastNameNorm = (lastname || "").trim();

    if (!lastNameNorm) {
      const err = new Error("Lastname is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!dob) {
      const err = new Error("Date of birth is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const emailNorm = (bodyEmail || "").trim().toLowerCase();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(emailNorm)) {
      const err = new Error("Invalid email format");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dobRegex.test(dob)) {
      const err = new Error("DOB must be in YYYY-MM-DD format");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (urlEmailNorm !== emailNorm) {
      const err = new Error("Email must match in payload and url");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    // Work checks

    const companyNameNorm = (companyname || "").trim();

    if (!companyNameNorm) {
      const err = new Error("Companyname is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    if (!salary) {
      const err = new Error("Salary is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const currencyNorm = (currency || "").trim();

    if (!currencyNorm) {
      const err = new Error("Currency is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const intSalary = Number(salary);

    if (
      Number.isNaN(intSalary) ||
      !Number.isInteger(intSalary) ||
      intSalary <= 0
    ) {
      const err = new Error("Salary must be a number and bigger than 0");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    // Home checks

    const countryNorm = (country || "").trim();

    if (!countryNorm) {
      const err = new Error("Country is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const cityNorm = (city || "").trim();

    if (!cityNorm) {
      const err = new Error("city is required");
      err.httpStatus = 400;
      err.code = "APP_BAD_REQUEST";
      throw err;
    }

    const existingParticipant = await this.Participant.findOne({
      where: { email: urlEmailNorm },
    });

    if (!existingParticipant) {
      const err = new Error("No participant found");
      err.httpStatus = 404;
      err.code = "APP_NOT_FOUND";
      throw err;
    }

    const updateParticipant = await this.Participant.sequelize.transaction(
      async (t) => {
        await this.Participant.update(
          {
            email: urlEmailNorm,
            firstname: firstNameNorm,
            lastname: lastNameNorm,
            dob: dob,
          },
          {
            where: { id: existingParticipant.id },
            transaction: t,
          }
        );

        await this.Work.update(
          {
            companyname: companyNameNorm,
            salary: intSalary,
            currency: currencyNorm,
          },
          {
            where: { ParticipantId: existingParticipant.id },
            transaction: t,
          }
        );

        await this.Home.update(
          {
            country: countryNorm,
            city: cityNorm,
          },
          {
            where: { ParticipantId: existingParticipant.id },
            transaction: t,
          }
        );

        const refreshed = await this.Participant.findOne({
          where: { id: existingParticipant.id },
          include: [{ model: this.Work }, { model: this.Home }],
          transaction: t,
        });

        return refreshed;
      }
    );

    return updateParticipant;
  }

  async deleteByEmail(email) {
    const emailNorm = (email || "").trim().toLowerCase();

    const existingParticipant = await this.Participant.findOne({
      where: { email: emailNorm }
    });

    if (!existingParticipant) {
      const err = new Error("No participant found");
      err.httpStatus = 404;
      err.code = "APP_NOT_FOUND";
      throw err;
    }

    const deleteParticipant = await this.Participant.sequelize.transaction(
        async (t) => {
            await this.Work.destroy(
                {
                    where: { ParticipantId: existingParticipant.id },
                    transaction: t,
                }
            );

            await this.Home.destroy(
                {
                    where: { ParticipantId: existingParticipant.id },
                    transaction: t,
                }
            );

            await this.Participant.destroy(
                {
                    where: { email: emailNorm },
                    transaction: t,
                }
            );

            return { deleted: true };
        }
    )

    return deleteParticipant;
  }
}

module.exports = ParticipantService;
