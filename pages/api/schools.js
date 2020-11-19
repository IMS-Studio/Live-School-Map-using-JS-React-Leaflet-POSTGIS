import { Client } from 'pg'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async (req, res) => {
  const pg = new Client({
    connectionString: process.env.dbconnection
  })

  await pg.connect()
  const { bbox } = JSON.parse(req.body)
  if (!bbox) {
    res.send([])
    return
  }
  const { rows } = await pg.query(
    `SELECT
      "ID", "SchoolName", "AddressStreet", "AddressCity", "AddressState", "AddressZip", ST_X(geom) as long, ST_Y(geom) as lat
    FROM schools
    WHERE ST_DWithin(geom, ST_MakeEnvelope(${bbox.join(',')}, 4326), 0)`
  )
  res.send(rows)
  await pg.end()
}
