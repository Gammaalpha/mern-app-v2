import express, { Response, Request } from "express";
import passport, { AuthenticateOptions } from "passport";
const router = express.Router();
const loginRequest = {
    scopes: ["openid", "profile", "User.Read", "offline_access"],
    prompt: "select_account"
}
const authenticateOptions: AuthenticateOptions = {
    // response: res,
    prompt: loginRequest.prompt,
    failureRedirect: "/signin",
    failureFlash: true,
    successRedirect: "/"
}
router.get('/signin', function (req, res, next) {
    passport.authenticate('azuread-openidconnect', authenticateOptions, function (err: any, user: any, info: any) {

        if (err) { return next(err); }
        if (!user) { return res.redirect('/signin'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get("/session", (req: any, res: any) => {

    if (req.user !== undefined) {

        res.json({ "authenticated": true, "sessionInfo": req.session, "user": { ...req.user } })

    }
    else {
        res.json({ "authenticated": false })
    }
})


router.post("/callback",
    (req: Request, res: Response, next) => {
        // console.log("callback response:", res);

        passport.authenticate('azuread-openidconnect', {
            failureRedirect: "/",
            failureFlash: true,
            successRedirect: "/"
        })(req, res, next)
    })

router.get("/signout", (req: any, res: Response) => {
    req.session.destroy(function (err: Error) {
        req.logout();
        res.redirect('/');
    })
})


module.exports = router;
