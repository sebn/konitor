import ttyTable from 'tty-table'

const Table = ttyTable('automattic-cli-table')

export const pullTable = () => {
  const options = {
    GUTTER: 0, marginTop: 0, marginBottom: 0
  }
  const displayHeader = () => {
    var table = new Table(options)
    table.push(['Status', 'Name', 'Changes', 'Insertions', 'Deletions'])
    console.log(table.toString())
  }
  const displayRow = (status, name, changes, insertions, deletions) => {
    var table = new Table(options)
    table.push([status, name, changes, insertions, deletions])
    console.log(table.toString())
  }

  return { displayHeader, displayRow }
}
