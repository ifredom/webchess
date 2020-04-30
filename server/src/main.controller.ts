import { Application } from 'express';
import OktaJwtVerifier from '@okta/jwt-verifier';

import { PlayerController } from './controllers/player.controller';

export class Controller {
  private playerController: PlayerController;
  private jwtVerifier: any;

  constructor(private app: Application) {
    this.playerController = new PlayerController();
    this.routes();

    this.jwtVerifier = new OktaJwtVerifier({
      issuer: 'https://dev-232123.okta.com/oauth2/default',
      clientId: '0oaanm545S538wrmZ4x6',
      // assertClaims: {
      //   aud: 'api://default',
      // }
    });
  }

  public authRequired(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
      return res.json({message: 'no match'});
    }

    const accessToken = match[1];
    const expectedAudience = 'api://default';

    return this.jwtVerifier.verifyAccessToken(accessToken, expectedAudience)
      .then((jwt: any) => {
        req.jwt = jwt;
        res.json({ jwt })
        // next();
      })
      .catch((err: any) => {
        res.json({ error: err.message });
      });
  }

  public routes() {
    this.app.route('/').get(this.playerController.welcomeMessage);

    this.app.route('/auth').get(this.authRequired.bind(this), (req, res) => { res.json({m:'yes'}) });

    this.app.route('/players').get(this.playerController.getAllPlayers);
    this.app.route('/player').post(this.playerController.addNewPlayer);
    this.app.route('/player/:id').get(this.playerController.getPlayer);
    this.app.route("/player/:id").delete(this.playerController.deletePlayer);
    this.app.route('/player/:id').put(this.playerController.updatePlayer);
  }
}