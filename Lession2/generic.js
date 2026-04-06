class Generic {
    static add(entity, title, data) {
        entity.push(data);
        console.log(`${title} tạo thành công`);
    }

    static delete(id, entity, title) {
        const index = entity.findIndex(e => e.id === id);
        entity.splice(index, 1);
        console.log(`Xóa ${title} thành công`);
    }

    static edit(item, title, data) {
        Object.assign(item, data);
        console.log(`Cập nhật ${title} thành công`);
    }

    static handleById(id, entity, newData, title, callback) {
        const item = entity.find(c => c.id === id);
        if (!item) {
            console.log(`Không tìm thấy ${title} với ID: ${id}`);
            return 0;
        }
        if (callback) {
            callback(item, title, newData)
        };

        return item;
    }
}

module.exports = Generic;