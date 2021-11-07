/*
 * equivalent to: 
 * CREATE TABLE tags(
 *  name VARCHAR(255) UNIQUE,
 *  description TEXT,
 *  username VARCHAR(255),
 *  usage_count  INT NOT NULL DEFAULT 0
 * );
 */

const Sequelize = require('sequelize')
const { prefix } = require('../../common/common')

module.exports = function createTable(sequelize) {
	return sequelize.define('tags', {
		name: {
			type: Sequelize.STRING,
			unique: true,
		},
		description: Sequelize.TEXT,
		username: Sequelize.STRING,
		usage_count: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	})
}

module.exports = {
	/*
	* equivalent to: 
	* CREATE TABLE prefix(
	*  guildId INT UNIQUE
	*  name VARCHAR(255)
	* );
	*/
	table: (sequelize) => {
		return sequelize.define('prefix', {
			guildId : {
				type: Sequelize.INTEGER,
				unique: true,
			},
			letter: {
				type: Sequelize.STRING
			}			
		})
	},
	insert: async (table, guildId, letter) => {
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
	},
	get: async (table, guildId) => {
		// equivalent to: SELECT * FROM prefix WHERE guildId = 'guildId' LIMIT 1;
		const prefix = await table.findOne({ where: { guildId: guildId } })

		if (prefix)
			return prefix

		return null
	},
	edit: async (table, guildId, letter) => {
		const affectedRows = await table.update({ letter: letter }, { where: { guildId: guildId } })

        if (affectedRows > 0)
            return true

        return false
	}
}