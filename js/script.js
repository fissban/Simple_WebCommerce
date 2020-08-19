var productos =
    [
        {
            id: 1,
            nombre: "harina",
            precioUnitario: 35,
            cantidad: 9
        },
        {
            id: 2,
            nombre: "pan",
            precioUnitario: 25,
            cantidad: 120
        },
        {
            id: 3,
            nombre: "papa",
            precioUnitario: 52,
            cantidad: 20
        },
        {
            id: 4,
            nombre: "palta",
            precioUnitario: 55,
            cantidad: 23
        },
        {
            id: 5,
            nombre: "fideos",
            precioUnitario: 85,
            cantidad: 58
        },
        {
            id: 6,
            nombre: "aceite",
            precioUnitario: 350,
            cantidad: 85
        },
        {
            id: 7,
            nombre: "sopa",
            precioUnitario: 86,
            cantidad: 12
        },
    ];

var productos_comprados = [];
/****************************************************************/

/**
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
 * Funcion para dar formato a un numero y convertirlo en formato moneda argentina.
 * @param {*} num 
 */
function formatMoney(num)
{
    return (num).toLocaleString("es-ar", { style: "currency", currency: "ARS", minimumFractionDigits: 2 });
}

/**
 * Calcula y actualiza el total a pagar por el usuario de la lista de productos comprados.
 * Se modifica el elemento con el id='total'.
 */
function totalCompra()
{
    // se obtiene el total calculando el precio por la cantidad comprada.
    var total = 0;
    productos_comprados.forEach(unProducto =>
    {
        total += unProducto.precioUnitario * unProducto.cantidad;
    });
    // se actualiza el html con el nuevo total.
    //var mensaje = document.getElementById('total');

    alert('El Total de su compra es de ' + formatMoney(total) + '.');
    //mensaje.innerHTML = "Total: " + formatMoney(total);
}

/**
 * Se crea un <td> que contendra texto en su interior.
 * @param {*} texto 
 * @returns se retorna el td creado
 */
function create_td(text)
{
    var td = document.createElement('td');
    var txt = document.createTextNode(text);
    td.appendChild(txt);
    return td;
}

/**
 * Se crea un <td> que contendra un un button en su interior.
 * @param {*} id 
 * @param {*} text 
 * @param {*} style -> stock (btn-primary) / comprados (btn-danger)
 * @param {*} functionClick 
 * @returns se retorna el td creado
 */
function create_td_button(id, text, style, functionClick)
{
    var td = document.createElement('td');
    var btn = document.createElement('button');
    btn.classList.add('btn'); // Se agrega estilo definido por bootstrap
    btn.classList.add(style);
    // se define el atributo id para el boton
    btn.setAttribute('id', id);
    var txt = document.createTextNode(text);
    btn.appendChild(txt);
    // se agrega el listener click con su funcion.
    btn.addEventListener("click", functionClick);
    td.appendChild(btn);

    return td;
}

/**
 * Se crea un <td> con un input en su interior.
 * @returns se retorna el td creado
 */
function create_td_input()
{
    var td = document.createElement('td');
    var input = document.createElement('input');
    input.classList.add('form-control'); // se aplica el class indicado por bootstrap
    input.setAttribute('type', 'text'); // type generico para los de tipo texto
    input.setAttribute('placeHolder', 'indicar cantidad a comprar'); // texto sugerido
    input.setAttribute('aria-label', 'Sizing example input');
    td.appendChild(input);
    return td;
}

/**
 * Se crea un <tr> con varios <td> conteniendo toda la informacion de un producto.
 * Usado especialmente para representar la tabla de productos del supermcado.
 * @param {*} producto 
 */
function crete_tr_stock(producto)
{
    // Nombre
    var tdNombre = create_td(producto.nombre);
    // Precio
    var tdPrecio = create_td(formatMoney(producto.precioUnitario));
    // Cantidad
    var tdCantidad = create_td(producto.cantidad);
    // Boton
    var tdBoton = create_td_button(producto.id, 'Comprar', 'btn-primary', agregarCarrito);
    // Input
    var tdInput = create_td_input();

    // se crea el <tr> y se le agregan sus <td>
    var tr = document.createElement('tr');
    tr.classList.add('text-center'); // se agrega un estilo
    tr.appendChild(tdNombre);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdCantidad);

    tr.appendChild(tdInput);
    tr.appendChild(tdBoton);

    // se agrega el <tr> a una tabla especifica
    var tbody = document.getElementById('table_stock');
    tbody.appendChild(tr);
}

/**
 * Se crea un <tr> con varios <td> conteniendo toda la informacion de un producto.
 * Usado especialmente para representar la tabla de productos comprados por el usuario.
 * @param {*} producto
 */
function create_tr_buy(producto)
{
    // Nombre
    var tdNombre = create_td(producto.nombre);
    // Precio
    var tdPrecio = create_td(formatMoney(producto.precioUnitario));
    // Cantidad
    var tdCantidad = create_td(producto.cantidad);
    // Boton
    // XXX se ajusta el id del botton para que no coincida con lo del stock
    var tdBoton = create_td_button(producto.id + '_delete', 'Borrar', 'btn-danger', borrarCarrito);
    // Subtotal
    var tdSubTotal = create_td(formatMoney(producto.precioUnitario * producto.cantidad));

    // se crea el <tr> y se le agregan sus <td>
    var tr = document.createElement('tr');
    tr.classList.add('text-center'); // se agrega un estilo
    tr.appendChild(tdNombre);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdCantidad);

    tr.appendChild(tdSubTotal);
    tr.appendChild(tdBoton);

    // se agrega el <tr> a una tabla especifica
    var tbody = document.getElementById('table_buy');
    tbody.appendChild(tr);
}

/**
 * Funcion para borrar un producto del carrito.
 * Es ejecutado desde un button en el html.
 */
function borrarCarrito(e)
{
    // se obtiene el id del button
    var id_button = e.target.id;
    // el id de los botones para borrar productos comprados tiene el formato 'xxx_delete'
    // donde 'xxx'='id es el id del producto'.
    var id_button_number = id_button.replace('_delete', '');
    // se obtiene el indice de un producto de acuerdo a su id.
    var index = productos_comprados.findIndex(p => p.id == id_button_number);
    var productosDevueltos = productos_comprados[index].cantidad;
    // se borra el producto deseado del vector.
    productos_comprados.splice(index, 1);

    // a partir de su id obtenemos el button
    var button = document.getElementById(id_button);
    // a partir del button obtenemos <td> -> <tr>
    var nodo_tr = button.parentNode.parentNode; // <tr>
    // se borra el <tr> del tbody
    var tbody = document.getElementById('table_buy');
    tbody.removeChild(nodo_tr);

    // Como se cancela la venta de un productos se debe volver a incrementar el stock de los productos originales.
    // el id del button de stock y de los productos comprados son iguales con la diferencia
    // de q los comprados tienen el 'xxx_delete' asique el id del borrado nos sirve de guia
    // para encontrar el del stock
    var indexStock = productos.findIndex(p => p.id = id_button_number);
    // a pesar de que los valores son numeros al momento de sumarlos los tomaba como un texto
    // y los concatenaba.
    productos[indexStock].cantidad = parseInt(productos[indexStock].cantidad) + parseInt(productosDevueltos);

    var cantidad_html = document.getElementById(id_button_number).parentNode.previousSibling.previousSibling.firstChild;
    cantidad_html.textContent = productos[indexStock].cantidad;

    // se actualiza el total de la compra.
    //updateTotal();
}

/**
 * Funcion para agregar un producto al carrito.
 * Es ejecutado desde un button en el html.
 */
function agregarCarrito(e)
{
    // se obtiene el input.
    var input = e.target.parentNode.previousSibling.firstChild;
    // se obtiene el valor ingresado en el input.
    var cantidad_a_comprar = input.value;

    // se asegura que se ingrese algun valor.
    if (cantidad_a_comprar == '')
    {
        alert('debe ingresar un monto a comprar.');
        return;
    }
    // se obtiene el id del button
    var id_button = e.target.id;
    // se verifica si el producto ya fue comprado o no.
    var index_comprados = productos_comprados.findIndex(p => p.id == id_button);
    if (index_comprados != -1)
    {
        alert('Este producto ya fue comprado.');
        return;
    }
    // se busca el index del producto comprado para conocer sus propiedades.
    var index = productos.findIndex(p => p.id == id_button);
    // se obtiene el producto segun su id
    var producto = productos[index];

    // se obtiene cada propiedad del producto
    var id = producto.id;
    var nombre = producto.nombre;
    var cantidad = producto.cantidad;
    var precio = producto.precioUnitario;

    // se verifica que el usuario no compre mas de lo que tenemos como stock
    if (cantidad_a_comprar > cantidad)
    {
        alert('esta comprando mas productos de lo que disponemos de stock!');
        return;
    }

    // se actualiza el valor del nuevo stock en el html.
    var cantidad_html = e.target.parentNode.previousSibling.previousSibling.firstChild;
    var stock = cantidad - cantidad_a_comprar;
    cantidad_html.textContent = stock;
    // se actualiza el valor en el vector (por referencia se actualiza el vector)
    // productos[index].cantidad = stock;
    producto.cantidad = stock;

    // se crea un objeto sencillo con la informacion del producto comprado
    var producto_aux =
    {
        id: id,
        nombre: nombre,
        precioUnitario: precio,
        cantidad: cantidad_a_comprar,
    };
    // se agrega el producto a la lista definitiva
    productos_comprados.push(producto_aux);
    // se crea el <tr> en la tabla de productos comprados enviando 'producto_aux'.
    create_tr_buy(producto_aux);
    // se actualiza el total de la compra.
    //updateTotal();
}

// ***************************************************************************************
// Aqui es donde inicia todo
// ***************************************************************************************
productos.forEach(item =>
{
    crete_tr_stock(item);
});