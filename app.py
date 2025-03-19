import os
from flask import Flask, request, render_template, redirect, url_for, session, flash, g
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from itsdangerous import URLSafeTimedSerializer as Serializer
from dotenv import load_dotenv
from datetime import timedelta
import pymongo

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "valor_por_defecto_seguro")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/db2")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")

bcrypt = Bcrypt(app)
serializer = Serializer(app.secret_key, salt='password-reset-salt')

# Configuración de la sesión
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

@app.route('/login2')
def loging2():
    return render_template('login2.html')


@app.before_request
def conectar_mongo():
    if 'mongo' not in g:
        try:
            g.mongo = MongoClient(MONGO_URI)
            g.db = g.mongo['db2']
            g.collection = g.db['usuarios']
        except Exception as e:
            flash(f"No se pudo conectar a la base de datos: {e}", "error")
            return redirect(url_for('login'))

@app.teardown_appcontext
def cerrar_mongo(exception):
    mongo = g.pop('mongo', None)
    if mongo is not None:
        mongo.close()

def enviar_email(destinatario, asunto, cuerpo):
    mensaje = Mail(
        from_email=os.getenv("SENDGRID_EMAIL"),
        to_emails=destinatario,
        subject=asunto,
        html_content=cuerpo
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(mensaje)
        print(f"Correo enviado con éxito! Status code: {response.status_code}")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")

@app.route('/')
def home():
    if 'usuario' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('pagina_principal'))

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        usuario = request.form['usuario']
        email = request.form['email']
        contrasena = request.form['contrasena']

        if g.collection.find_one({'$or': [{'email': email}, {'usuario': usuario}]}):
            flash("El usuario o correo ya está registrado.", "error")
            return redirect(url_for('registro'))

        hashed_password = bcrypt.generate_password_hash(contrasena).decode('utf-8')
        g.collection.insert_one({'usuario': usuario, 'email': email, 'contrasena': hashed_password})
        session['usuario'] = usuario
        return redirect(url_for('pagina_principal'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        contrasena = request.form['contrasena']
        user = g.collection.find_one({'usuario': usuario})

        if user and bcrypt.check_password_hash(user['contrasena'], contrasena):
            session['usuario'] = usuario
            flash("Inicio de sesión exitoso.", "success")  # Mensaje de éxito
            return redirect(url_for('pagina_principal'))
        else:
            flash("Usuario o contraseña incorrectos.", "error")  # Mensaje de error
    return render_template('login.html')


@app.route('/pagina_principal')
def pagina_principal():
    if 'usuario' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', usuario=session['usuario'])

@app.route('/mi_perfil')
def mi_perfil():
    if 'usuario' not in session:
        return redirect(url_for('login'))
    usuario = session['usuario']
    user_data = g.collection.find_one({'usuario': usuario})
    return render_template('mi_perfil.html', usuario=user_data['usuario'], email=user_data['email'])

@app.route('/recuperar_contrasena', methods=['GET', 'POST'])
def recuperar_contrasena():
    if request.method == 'POST':
        email = request.form['email']
        usuario = g.collection.find_one({'email': email})
        if usuario:
            token = serializer.dumps(email, salt='password-reset-salt')
            enlace = url_for('restablecer_contrasena', token=token, _external=True)
            asunto = "Recuperación de contraseña"
            cuerpo = f"""
            <p>Hola, hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p>Si no has solicitado este cambio, ignora este mensaje.</p>
            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="{enlace}">Restablecer contraseña</a>
            """
            enviar_email(email, asunto, cuerpo)
            flash("Te hemos enviado un correo para recuperar tu contraseña.", "success")
        else:
            flash("El correo electrónico no está registrado.", "error")
    return render_template('recuperar_contrasena.html')

@app.route('/restablecer_contrasena/<token>', methods=['GET', 'POST'])
def restablecer_contrasena(token):
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=3600)
    except:
        flash("El enlace de restablecimiento ha caducado o es inválido.", "error")
        return redirect(url_for('recuperar_contrasena'))
    
    if request.method == 'POST':
        nueva_contrasena = request.form['nueva_contrasena']
        hashed_password = bcrypt.generate_password_hash(nueva_contrasena).decode('utf-8')
        g.collection.update_one({'email': email}, {'$set': {'contrasena': hashed_password}})
        flash("Tu contraseña ha sido restablecida con éxito.", "success")
        return redirect(url_for('login'))
    return render_template('restablecer_contrasena.html')

@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
