import {NextApiRequest, NextApiResponse} from "next"

export default (req: NextApiRequest, res: NextApiResponse) => {
    const users = {
        key: 1, nome: "teste"
    }

    return res.json(users)
}