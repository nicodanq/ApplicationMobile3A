CREATE DATABASE application3A;
Use application3A;
# drop database application3A;
#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: User
#------------------------------------------------------------

-- 1. Table: Role
CREATE TABLE Role(
    ID_role INT NOT NULL AUTO_INCREMENT,
    role VARCHAR(50) NOT NULL,
    CONSTRAINT Role_PK PRIMARY KEY (ID_role)
) ENGINE=InnoDB;

-- 2. Table: TypeEtude
CREATE TABLE TypeEtude(
    ID_typeEtude INT NOT NULL AUTO_INCREMENT,
    typeEtude VARCHAR(50) NOT NULL,
    CONSTRAINT TypeEtude_PK PRIMARY KEY (ID_typeEtude)
) ENGINE=InnoDB;

-- 3. Table: TypeArticle
CREATE TABLE TypeArticle(
    ID_typeArticle INT NOT NULL AUTO_INCREMENT,
    typeArticle VARCHAR(50) NOT NULL,
    CONSTRAINT TypeArticle_PK PRIMARY KEY (ID_typeArticle)
) ENGINE=InnoDB;

-- 4. Table: StatutEtude
CREATE TABLE StatutEtude(
    ID_statutE INT NOT NULL AUTO_INCREMENT,
    StatutE VARCHAR(50) NOT NULL,
    CONSTRAINT StatutEtude_PK PRIMARY KEY (ID_statutE)
) ENGINE=InnoDB;

-- 5. Table: TypeEvenement
CREATE TABLE TypeEvenement(
    ID_typeEvenement INT NOT NULL AUTO_INCREMENT,
    typeEvent VARCHAR(50) NOT NULL,
    CONSTRAINT TypeEvenement_PK PRIMARY KEY (ID_typeEvenement)
) ENGINE=InnoDB;

-- 6. Table: User
CREATE TABLE User(
    ID_user INT NOT NULL AUTO_INCREMENT,
    prenom_user VARCHAR(50) NOT NULL,
    nom_user VARCHAR(50) NOT NULL,
    email_user VARCHAR(50) NOT NULL,
    mdp_user VARCHAR(50) NOT NULL,
    bio_user VARCHAR(50) NOT NULL,
    github_user VARCHAR(50) NOT NULL,
    dateCreation_user DATE NOT NULL,
    statut_user BOOL NOT NULL,
    dateNaissance DATE NOT NULL,
    CONSTRAINT User_PK PRIMARY KEY (ID_user)
) ENGINE=InnoDB;

-- 7. Table: Article
CREATE TABLE Article(
    Id_article INT NOT NULL AUTO_INCREMENT,
    description_article VARCHAR(50) NOT NULL,
    titre_article VARCHAR(50) NOT NULL,
    datePublication_article DATE NOT NULL,
    img_article VARCHAR(50) NOT NULL,
    auteur_article VARCHAR(50) NOT NULL,
    ID_user INT NOT NULL,
    CONSTRAINT Article_PK PRIMARY KEY (Id_article),
    CONSTRAINT Article_User_FK FOREIGN KEY (ID_user) REFERENCES User(ID_user)
) ENGINE=InnoDB;

-- 8. Table: Etude
CREATE TABLE Etude(
    Id_etude INT NOT NULL AUTO_INCREMENT,
    dateDebut_etude DATE NOT NULL,
    dateFin_etude DATE NOT NULL,
    prix_etude FLOAT NOT NULL,
    description_etude VARCHAR(50) NOT NULL,
    titre_etude VARCHAR(50) NOT NULL,
    dateCreation_etude VARCHAR(50) NOT NULL,
    nbrIntervenant INT NOT NULL,
    ID_statutE INT NOT NULL,
    CONSTRAINT Etude_PK PRIMARY KEY (Id_etude),
    CONSTRAINT Etude_StatutEtude_FK FOREIGN KEY (ID_statutE) REFERENCES StatutEtude(ID_statutE)
) ENGINE=InnoDB;

-- 9. Table: Evenement
CREATE TABLE Evenement(
    Id_Event INT NOT NULL AUTO_INCREMENT,
    date_Event DATE NOT NULL,
    titre_Event VARCHAR(50) NOT NULL,
    description_Event VARCHAR(50) NOT NULL,
    lieu_Event VARCHAR(50) NOT NULL,
    horaire_Event TIME NOT NULL,
    ID_typeEvenement INT NOT NULL,
    CONSTRAINT Evenement_PK PRIMARY KEY (Id_Event),
    CONSTRAINT Evenement_TypeEvenement_FK FOREIGN KEY (ID_typeEvenement) REFERENCES TypeEvenement(ID_typeEvenement)
) ENGINE=InnoDB;

-- 10. Table: Posseder
CREATE TABLE Posseder(
    ID_role INT NOT NULL,
    ID_user INT NOT NULL,
    CONSTRAINT Posseder_PK PRIMARY KEY (ID_role, ID_user),
    CONSTRAINT Posseder_Role_FK FOREIGN KEY (ID_role) REFERENCES Role(ID_role),
    CONSTRAINT Posseder_User0_FK FOREIGN KEY (ID_user) REFERENCES User(ID_user)
) ENGINE=InnoDB;

-- 11. Table: Effectuer
CREATE TABLE Effectuer(
    Id_etude INT NOT NULL,
    ID_user INT NOT NULL,
    coeff_retribution FLOAT NOT NULL,
    CONSTRAINT Effectuer_PK PRIMARY KEY (Id_etude, ID_user),
    CONSTRAINT Effectuer_Etude_FK FOREIGN KEY (Id_etude) REFERENCES Etude(Id_etude),
    CONSTRAINT Effectuer_User0_FK FOREIGN KEY (ID_user) REFERENCES User(ID_user)
) ENGINE=InnoDB;

-- 12. Table: PossederEtude
CREATE TABLE PossederEtude(
    ID_typeEtude INT NOT NULL,
    Id_etude INT NOT NULL,
    CONSTRAINT PossederEtude_PK PRIMARY KEY (ID_typeEtude, Id_etude),
    CONSTRAINT PossederEtude_TypeEtude_FK FOREIGN KEY (ID_typeEtude) REFERENCES TypeEtude(ID_typeEtude),
    CONSTRAINT PossederEtude_Etude0_FK FOREIGN KEY (Id_etude) REFERENCES Etude(Id_etude)
) ENGINE=InnoDB;

-- 13. Table: Participer
CREATE TABLE Participer(
    ID_user INT NOT NULL,
    Id_Event INT NOT NULL,
    CONSTRAINT Participer_PK PRIMARY KEY (ID_user, Id_Event),
    CONSTRAINT Participer_User_FK FOREIGN KEY (ID_user) REFERENCES User(ID_user),
    CONSTRAINT Participer_Evenement0_FK FOREIGN KEY (Id_Event) REFERENCES Evenement(Id_Event)
) ENGINE=InnoDB;

-- 14. Table: PossederArticle
CREATE TABLE PossederArticle(
    Id_article INT NOT NULL,
    ID_typeArticle INT NOT NULL,
    CONSTRAINT PossederArticle_PK PRIMARY KEY (Id_article, ID_typeArticle),
    CONSTRAINT PossederArticle_Article_FK FOREIGN KEY (Id_article) REFERENCES Article(Id_article),
    CONSTRAINT PossederArticle_TypeArticle0_FK FOREIGN KEY (ID_typeArticle) REFERENCES TypeArticle(ID_typeArticle)
) ENGINE=InnoDB;

-- INSERTIONS de données testables
-- Tu pourras adapter dynamiquement les ID une fois les lignes créées, avec SELECT LAST_INSERT_ID()

INSERT INTO Role(role) VALUES ('Admin'), ('Intervenant'), ('Élève');
INSERT INTO TypeEtude(typeEtude) VALUES ('Enquête'), ('Analyse de données'), ('Test produit');
INSERT INTO TypeArticle(typeArticle) VALUES ('Tutoriel'), ('Actualité'), ('Opinion');
INSERT INTO StatutEtude(StatutE) VALUES ('En cours'), ('Terminée');
INSERT INTO TypeEvenement(typeEvent) VALUES ('Conférence'), ('Atelier');


select * from role;

SELECT user, host FROM mysql.user WHERE user = 'root';
CREATE USER 'firebaseuser'@'%' IDENTIFIED BY 'firebase123';
GRANT ALL PRIVILEGES ON application3A.* TO 'firebaseuser'@'%';
FLUSH PRIVILEGES;