import Sequelize from 'sequelize'

/*
* equivalent to: 
* CREATE TABLE prefix(
*  guildId INT UNIQUE
*  name VARCHAR(255)
* );
*/

export function table(sequelize) {
	return sequelize.define('prefix', {
		guildId : {
			type: Sequelize.INTEGER,
			unique: true,
		},
		letter: {
			type: Sequelize.STRING
		}			
	})
}

export async function insert(table, guildId, letter) {
	try {
		// equivalent to: INSERT INTO prefix (guildId, letter) values (?, ?, ?);
		const prefix = await table.create({
			guildId: guildId,
			letter: letter
		})

		return prefix
	}
	catch (error) {
		return null
	}
}

export async function get(table, guildId) {
	// equivalent to: SELECT * FROM prefix WHERE guildId = 'guildId' LIMIT 1;
	const prefix = await table.findOne({ where: { guildId: guildId } })

	if (prefix)
		return prefix

	return null
}

export async function edit(table, guildId, letter) {
	const affectedRows = await table.update({ letter: letter }, { where: { guildId: guildId } })

	if (affectedRows > 0)
		return true

	return false
}