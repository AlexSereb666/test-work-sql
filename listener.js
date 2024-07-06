const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'TEST',
    password: '12345',
    port: 5432,
});

client.connect();

client.on('notification', async (msg) => {
    if (msg.channel === 'variablecell_change') {
        const readerId = parseInt(msg.payload, 10);
        console.log(`Получено уведомление для readerId: ${readerId}`);

        const updateQuery = `
            UPDATE tablepointload
            SET startcycle = startcycle + 1
            WHERE readerid = $1
        `;
        await client.query(updateQuery, [readerId]);
        console.log(`Значение startcycle обновлено для readerId: ${readerId}`);
    }
});

client.query('LISTEN variablecell_change');

console.log('Ожидание изменений в variablecell...');

// дополнительная информация к выполнению тестового задания //
/*

Создание таблицы tablereader:
CREATE TABLE tablereader (
    id SERIAL PRIMARY KEY,
    cardnumber VARCHAR(32),
    variablecell INT
);

Создание таблицы tablepointload:
CREATE TABLE tablepointload (
    id SERIAL PRIMARY KEY,
    readerid INT REFERENCES tablereader(id),
    startcycle INT
);

Создание функции для уведомлений:
CREATE OR REPLACE FUNCTION notify_variablecell_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('variablecell_change', NEW.id::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

Создание триггера для вызова функции:
CREATE TRIGGER variablecell_change_trigger
AFTER UPDATE OF variablecell ON tablereader
FOR EACH ROW
EXECUTE FUNCTION notify_variablecell_change();

 */
