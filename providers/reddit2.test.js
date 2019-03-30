const reddit = require('./reddit2.js');

test('calls getImage and sees if it gets results', () => {
    const expected_id = /\w+/;
    const expected_url = /.*(jpg|png|jpeg)$/
    return reddit.getImage().then(data => {
        expect(data).toHaveProperty('type', 'reddit')
        expect(data).toHaveProperty('id')
        expect(data.id).toMatch(expected_id)
        expect(data).toHaveProperty('caption')
        expect(data).toHaveProperty('from')
        expect(data).toHaveProperty('url')
        expect(data.url).toMatch(expected_url)
    })
});
