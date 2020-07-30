export interface User {
  account: {
    email: string,
    password: string,
  };
  profile: {
    title: string,
    forename: string,
    surname: string,
    institution: string,
    city: string,
    researchArea: string,
  };
}
