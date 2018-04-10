const storage = {};

module.exports = {
	read,
	create,
	delete:_delete,
	list,
};

function create(place, record) { // Make something
	if (!storage[place]) storage[place]={};

	if (!record) throw new Error(`You didn't give me anything to store at ${place}`);

	record.id = `${place}-${Date.now()}`;

	storage[place][record.id] = record;

	return record;
}

function read(place, record_id) { // Read a single something
	if (!storage[place]) storage[place]={};

	const record = storage[place][record_id];

	if (!record) throw new Error(`No Record Found`);

	return record;
}

function list(place) { // find many something
	if (!storage[place]) storage[place]={};

	return Object.keys(storage[place])
		.map(id => storage[place]);
}

function _delete(place, record_id) { // delete single thing
	if (!storage[place]) storage[place]={};

	const record = storage[place][record_id] || null;

	delete storage[place][record_id];

	return record;
}
