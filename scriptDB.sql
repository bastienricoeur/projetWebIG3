CREATE TABLE Utilisateur (
    mail VARCHAR(30) NOT NULL,
    nom VARCHAR(30) NOT NULL,
    prenom VARCHAR(30) NOT NULL,
    adresse VARCHAR(50) NOT NULL,
    telephone VARCHAR(16),
    mdp VARCHAR(64) NOT NULL,
    isAdmin boolean,
    PRIMARY KEY(mail)
);


CREATE TABLE CarteBleue (
    numeroCB VARCHAR(16) NOT NULL,
    dateExpiration DATE NOT NULL,
    titulaire VARCHAR(40) NOT NULL,
    pictogramme INTEGER NOT NULL,
    banque VARCHAR(30) NOT NULL,
    PRIMARY KEY(numeroCB)
);

CREATE TABLE ProprietaireCarte (
    numeroCB VARCHAR(16) NOT NULL,
    mail VARCHAR(30) NOT NULL,
    PRIMARY KEY(numeroCB,mail),
    CONSTRAINT FK_Carte_numero FOREIGN KEY (numeroCB) REFERENCES CarteBleue(numeroCB) ON DELETE CASCADE,
    CONSTRAINT FK_Utilisateur_mail FOREIGN KEY (mail) REFERENCES Utilisateur(mail) ON DELETE CASCADE
);

CREATE TABLE TypeArticle (
    numeroType SERIAL NOT NULL,
    libelle VARCHAR(20) NOT NULL,
    PRIMARY KEY(numeroType)
);

CREATE TABLE Article (
    numeroArt SERIAL NOT NULL,
    nom VARCHAR(30) NOT NULL,
    description VARCHAR(200) NOT NULL,
    prix FLOAT NOT NULL,
    nbExempStock INTEGER NOT NULL,
    cheminImg VARCHAR(200),
    typeArticle INTEGER NOT NULL,
    PRIMARY KEY(numeroArt),
    CONSTRAINT FK_TypeArticle_numero FOREIGN KEY (typeArticle) REFERENCES TypeArticle(numeroType)
);

CREATE TABLE Commande (
    numeroCom SERIAL NOT NULL,
    dateCom DATE NOT NULL,
    mail VARCHAR(30) NOT NULL,
    PRIMARY KEY(numeroCom),
    CONSTRAINT FK_Commande_mailCom FOREIGN KEY (mail) REFERENCES Utilisateur(mail) ON DELETE CASCADE
);

CREATE TABLE ContenuCommande (
    numeroCom INTEGER NOT NULL,
    numeroArt INTEGER NOT NULL,
    quantite INTEGER NOT NULL,
    PRIMARY KEY(numeroCom,numeroArt),
    CONSTRAINT FK_Commande_numeroCom FOREIGN KEY (numeroCom) REFERENCES Commande(numeroCom) ON DELETE CASCADE,
    CONSTRAINT FK_Article_numeroArt FOREIGN KEY (numeroArt) REFERENCES Article(numeroArt)
);

CREATE TABLE Facture (
    numeroFac SERIAL NOT NULL,
    adresseLivraison VARCHAR(50) NOT NULL,
    prixTotal FLOAT DEFAULT NULL,
    numeroCB VARCHAR(16) NOT NULL,
    numeroCom INTEGER NOT NULL,
    PRIMARY KEY(numerofac),
    CONSTRAINT FK_Facture_numeroCB FOREIGN KEY (numeroCB) REFERENCES CarteBleue(numeroCB),
    CONSTRAINT FK_Facture_numeroCom FOREIGN KEY (numeroCom) REFERENCES Commande(numeroCom) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION verif_artdispo() RETURNS trigger AS $verif_artdispo$
DECLARE nb integer;
BEGIN
  SELECT nbExempStock INTO nb FROM Article WHERE numeroArt= NEW.numeroArt;
  IF NEW.quantite = 0 THEN
    RAISE EXCEPTION 'La quantite doit etre superieur a 0';
  ELSEIF NEW.quantite > nb THEN
    RAISE EXCEPTION 'Il n y a plus assez d exemplaire en stock';
  ELSE
    RETURN NEW;
  END IF;
END;
$verif_artdispo$ LANGUAGE plpgsql;

CREATE TRIGGER verif_artdispo BEFORE INSERT OR UPDATE ON ContenuCommande
FOR EACH ROW EXECUTE PROCEDURE verif_artdispo();


CREATE OR REPLACE FUNCTION upt_nbstock() RETURNS trigger AS $upt_nbstock$
BEGIN
  UPDATE Article SET nbExempStock = nbExempStock-NEW.quantite WHERE numeroArt = NEW.numeroArt;
  RETURN NEW;
END;
$upt_nbstock$ LANGUAGE plpgsql;

CREATE TRIGGER upt_nbstock AFTER INSERT OR UPDATE ON ContenuCommande
FOR EACH ROW EXECUTE PROCEDURE upt_nbstock();

CREATE OR REPLACE FUNCTION calculate_price() RETURNS trigger AS $calculate_price$
DECLARE price decimal;
BEGIN
  SELECT SUM(cc.quantite*a.prix) INTO price FROM Article a, ContenuCommande cc WHERE a.numeroArt=cc.numeroArt AND cc.numeroCom=NEW.numeroCom;
  NEW.prixTotal:=price;
  RETURN NEW;
END;
$calculate_price$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_price BEFORE INSERT OR UPDATE ON Facture
FOR EACH ROW EXECUTE PROCEDURE calculate_price();

INSERT INTO Utilisateur VALUES('admin@mail.fr', 'ricoeur', 'bastien', '4 rue des bruyères', '0606060606', '69fa12a9b0934cdc81a13cb50c08ed44fbf2a383e6ef4b5f670b565e289c63ab', true);
INSERT INTO Utilisateur VALUES('user1@mail.fr', 'user', 'one', '1 rue des horloges', '0634373737', 'dcb6c01ca04ce5894d5cdd3a20506f7a72068a71953925cd481dd3f42a4e48fa', false);
INSERT INTO Utilisateur VALUES('user2@mail.fr', 'user', 'two', '2 rue des horloges', '0634373739', '9f23d2f3c75b0396e842ef8bcff996c37d8ee71fd868d1281d55a698a4e1ab6d', false);


INSERT INTO TypeArticle VALUES(DEFAULT,'table');
INSERT INTO TypeArticle VALUES(DEFAULT,'chaise');
INSERT INTO TypeArticle VALUES(DEFAULT,'canapé');
INSERT INTO TypeArticle VALUES(DEFAULT,'lampe');
INSERT INTO TypeArticle VALUES(DEFAULT,'objet décoratif');


INSERT INTO Article VALUES(DEFAULT,'Table avec motif','Table motif super sympa',437.34,1,'http://www.leblogdeco.fr/wp-content/2011/01/table-bois-design-captain-world-is-law.jpg',1);
INSERT INTO Article VALUES(DEFAULT,'Chaise design','Chaise ergonomique et design',87.99,10,'http://www.drawer.fr/13144-thickbox/2x-chaises-design-ralf-wood.jpg',2);
INSERT INTO Article VALUES(DEFAULT,'Canapé cuir 3 places','Canapé en cuir véritable assemblé à la main',1345.49,2,'http://image.but.fr/is/image/but/4894223184496_F?$thumbnail_m$',3);
INSERT INTO Article VALUES(DEFAULT,'Lampe type industriel','Lampe inspiré du style industriel',210,4,'http://www.lestendances.fr/images/produits/lampe-trepied-bois-industriel-36166.jpg',4);
INSERT INTO Article VALUES(DEFAULT,'Cousin motif','Cousin à motifs géométriques',18.99,20,'https://galerie.alittlemarket.com/galerie/sell/827217/textiles-et-tapis-housse-de-coussin-motif-cubik-bleu-10527707-img-1492-ade83-aacd3_big.jpg',5);

