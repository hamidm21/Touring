import { countAll, findAll } from "./dal";

export function CountAll(tourId: number): Promise<any> {
    return countAll(tourId);
}

export async function getAll(page: number, tourId: number): Promise<any> {
    const users = await findAll({take: 10, skip: (page - 1) * 10, id: tourId });
    const totalCount = users.length;
    return Promise.resolve({users, pages: Math.ceil(totalCount / 10)});
}
