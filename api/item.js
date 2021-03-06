module.exports = (app, serviceItem, serviceList, jwt) => {
    app.get("/items/:id", jwt.validateJWT, async (req, res) => {
        try {
            res.json(await serviceItem.dao.getAllFromList(req.params.id, req.user.id));
        }
        catch (e) {
            res.status(500).end();
        }
    });

    app.get("/itemsPartage/:id", jwt.validateJWT, async (req, res) => {
        try {
            res.json(await serviceItem.dao.getAllFromPartageList(req.params.id, req.user.id));
        }
        catch (e) {
            res.status(500).end();
        }
    });

    app.post("/item", jwt.validateJWT, (req, res) => {
        const item = req.body;
        if (!serviceItem.isValid(item))  {
            return res.status(400).end();
        }
        serviceItem.dao.insert(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end()
            });
    });

    app.get("/items", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getAll(req.user.id);
            if (!(!!item)) return res.status(404).end();
            return res.json(item)
        } catch (e) {
            console.log(e);
            res.status(400).end() ;
        }
    });

    app.get("/item/:id", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getById(req.params.id);
            if (item === undefined || item.length == 0) return res.status(404).end();
            const list = await serviceList.dao.getById(item[0].listid);
            if (list[0].useraccountid !== req.user.id) return res.status(403).end();
            res.json(item);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });

    app.get("/itemPartage/:id", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getById(req.params.id);
            if (item === undefined || item.length == 0) return res.status(404).end();
            const list = await serviceList.dao.getPartageById(item[0].listid, req.user.id);
            if (!(!!list) ||list.user_id !== req.user.id) return res.status(403).end();
            res.json(item);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });

    app.delete("/item/:id", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getById(req.params.id);
            const list = await serviceList.dao.getById(item[0].listid);
            if (item === undefined || item.length == 0) return res.status(404).end();
            if (list[0].useraccountid !== req.user.id) return res.status(403).end();
            serviceItem.dao.delete(req.params.id)
                .then(res.status(200).end())
                .catch(e => {
                    console.log(e);
                    res.status(500).end();
                })
        }
        catch (e) { res.status(400).end(); }
    });

    app.delete("/itemPartage/:id", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getById(req.params.id);
            const list = await serviceList.dao.getPartageById(item[0].listid, req.user.id);
            if (!(!!item) || item.length == 0) return res.status(404).end();
            if (list.user_id !== req.user.id) return res.status(403).end();
            serviceItem.dao.delete(req.params.id)
                .then(res.status(200).end())
                .catch(e => {
                    console.log(e);
                    res.status(500).end();
                })
        }
        catch (e) { res.status(400).end(); }
    });
    app.put("/item", jwt.validateJWT, async (req, res) => {
        const item = req.body;
        const originalItem = await serviceItem.dao.getById(item.id);
        if ((item.id === undefined) || (item.id == null) || (!serviceItem.isValid(item))) return res.status(400).end();
        const list = await serviceList.dao.getById(originalItem[0].listid);
        if (item === undefined || item.length == 0) return res.status(404).end();
        if (list[0].useraccountid !== req.user.id) return res.status(403).end();
        serviceItem.dao.update(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end();
            });
    });

    app.put("/itemPartage", jwt.validateJWT, async (req, res) => {
        const item = req.body;
        const originalItem = await serviceItem.dao.getById(item.id);
        if (!(!!item.id) || (!serviceItem.isValid(item))) return res.status(400).end();
        const list = await serviceList.dao.getPartageById(originalItem[0].listid, req.user.id);
        if (item === undefined || item.length == 0) return res.status(404).end();
        if (list.user_id !== req.user.id) return res.status(403).end();
        serviceItem.dao.update(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end();
            });
    });
};
