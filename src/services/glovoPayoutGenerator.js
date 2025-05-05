import xlsx     from 'xlsx'
import path     from 'path'
import fs       from 'fs/promises'
import { prisma } from '../lib/prisma'

const TEMPLATE = path.resolve(
  __dirname,
  '../../templates/GLOVO_MODEL_pfa_srl_CU_TVA.xlsx'
)

export async function generateWeeklyGlovoDocs({ organizationId }) {
  // 1) load the template once
  const templateWB = xlsx.readFile(TEMPLATE)

  // 2) pull all Glovo entries in that org
  const entries = await prisma.entry.findMany({
    where: { organizationId, platform: 'GLOVO' },
    include: { salaryHistories: true }
  })

  // 3) for each entry, fill in the right sheet and write out
  for (let entry of entries) {
    const wb = xlsx.utils.book_new()
    const companySheetName = entry.companyType  // “PFA” or “SRL”
    const sheet = templateWB.Sheets[companySheetName]
    if (!sheet) continue

    // copy the sheet into our new workbook
    xlsx.utils.book_append_sheet(wb, sheet, companySheetName)

    // find latest salary
    const latest = [...entry.salaryHistories]
      .sort((a,b) => new Date(b.changedAt) - new Date(a.changedAt))[0] || {}

    // now map your fields into specific cells
    // e.g. cell B2 is “Total earnings” in your template:
    sheet['B2'].v = latest.amount
    // … repeat for each of the formulas in your model …
    // the template already has Excel formulas in other cells
    // so as soon as you write the raw inputs, they’ll recalc on open

    // 4) write out a file
    const outDir = path.resolve(__dirname, '../../public/uploads/glovo')
    await fs.mkdir(outDir, { recursive: true })
    const filename = `${entry.fullName
      .replace(/\W+/g,'_')
      .toLowerCase()}_${new Date().toISOString().slice(0,10)}.xlsx`
    const outPath = path.join(outDir, filename)
    xlsx.writeFile(wb, outPath)
  }
}
