using System;
using System.IO;
using System.Collections.Generic;

class Program
{

    // nuestra lista ahora sera una lista de diccionarios, ya veras su poder
    static List<Dictionary<string, dynamic>> listaEquipos = new List<Dictionary<string, dynamic>>();

    // El ref indica que cambiara la variable metida en el atributo lista
    public static void LeerArchivo(string ruta, ref List<Dictionary<string, dynamic>> lista)
    {

        // esto es una lista de lineas, cada linea leida se guarda aqui

        // esto es un string jaja 
        String line;
        // intentatemo ejecutar algo, si da error, lo dira en la consola
        try
        {
            // Creare una clase para leer tener la lectura del Stream
            // En esta linea tienes que definir la ruta del archivo a leer
            StreamReader lector = new StreamReader(ruta);
            // Leer la primera linea del txt
            line = lector.ReadLine();

            // Aqui separaremos la linea en comas 


            // Aqui seguira leyendo hasta que la linea sea NULA
            while (line != null)
            {

                // Aqui asignaremos los valores a los elementos del diccionario de la lista creada temporalmente
                var valores = line.Split(',');

                // Aqui creamos un diccionario temporal para luego añadirlo a la lista de diccionarios
                Dictionary<string, dynamic> diccionario = new Dictionary<string, dynamic>();

                // Aqui rellenaremos el diccionario con los valores dados
                diccionario.Add("nombre", valores[0]);

                // Este ciclo tiene un paso 2, empieza desde 1, porque 0 es el nombre del equipo
                int numeropartido = 1;
                for (int i = 1; i < valores.Length; i += 2)
                {
                    // Mira esto, aqui agrega un gfpartido, agregando el valor en tipo Integer
                    diccionario.Add($"GFpartido{numeropartido}", int.Parse(valores[i]));

                    // Si la casilla que le sigue es nula, osea que se te olvido colocar GCpartido, le asigna un 0
                    // Si no existen ninguna del las dos, entonces ya habra finalizado el ciclo
                    // Significa que le puedes poner tantos partidos como quieras
                    if (i + 1 >= valores.Length)
                    {
                        diccionario.Add($"GCpartido{numeropartido}", 0);
                    }
                    else
                    {
                        diccionario.Add($"GCpartido{numeropartido}", int.Parse(valores[i + 1]));
                    }
                    numeropartido++;
                }

                lista.Add(diccionario);
                line = lector.ReadLine();


            }
            //okok
            // estoy solucionando un error 
            // Cerrar lector para evitar fugas de memoria 
            lector.Close();
        }
        catch (Exception e)
        {
            Console.WriteLine("Error: " + e.Message);
        }
    }




    public static List<Dictionary<string, dynamic>> CrearLista(List<Dictionary<string, dynamic>> lista)
    {
        // Crear la lista que se retornara luego
        List<Dictionary<string, dynamic>> estadisticas = new List<Dictionary<string, dynamic>>();

        // Iterar por los elementos de la lista que introducimos a la funcion
        foreach (Dictionary<string, dynamic> i in lista)
        {
            // Crear diccionario temporal
            Dictionary<string, dynamic> diccionario = new Dictionary<string, dynamic>();

            // Agregar nombre
            diccionario.Add("nombre", i["nombre"]);

            // Crear variables temporales
            int GF = 0, GC = 0, PG = 0, PE = 0, DifGoles = 0, PReal = 0, PVirtual = 0;

            // Iterar por cada partido del equipo
            for (int j = 1; j < i.Count - 1; j++)
            {
                if (i.ContainsKey("GFpartido" + j) && i.ContainsKey("GCpartido" + j))
                {
                    // Ganar
                    if (i["GFpartido" + j] > i["GCpartido" + j])
                    {
                        PG++;
                    }
                    // Empatar
                    else if (i["GFpartido" + j] == i["GCpartido" + j])
                    {
                        PE++;
                    }
                    GF += i["GFpartido" + j];
                    GC += i["GCpartido" + j];
                }

            }

            // Resta de goles a favor con goles en contra
            DifGoles = GF - GC;
            PReal = PG * 3 + PE;
            PVirtual = PReal + DifGoles;

            // Escribir datos en el diccionario temporal
            diccionario.Add("PG", PG);
            diccionario.Add("PE", PE);
            diccionario.Add("GF", GF);
            diccionario.Add("GC", GC);
            diccionario.Add("Dif Goles", DifGoles);
            diccionario.Add("P Real", PReal);
            diccionario.Add("P Virtual", PVirtual);

            // Agregar diccionario temporal a la lista que se retornara
            estadisticas.Add(diccionario);
        }

        return estadisticas;
    }

    public static void EscribirLista(List<Dictionary<string, dynamic>> lista)
    {
        // Generar una lista de lineas strings
        List<string> lineas = new List<string>(); ;
        foreach (Dictionary<string, dynamic> i in lista)
        {
            // Concatenar los valores que deseamos imprimir
            lineas.Add($"{i["nombre"]}, {i["Dif Goles"]}, {i["P Real"]}, {i["P Virtual"]}");
        }

        // Escribir todas las lineas en el archivo pronosticos.txt
        File.WriteAllLines(Path.Combine("pronosticos.txt"), lineas);
    }
    public static void ImprimirPeorEquipo(List<Dictionary<string, dynamic>> lista)
    {
        // TODO: Imprimir el equipo con menor puntaje en P Real, de la tabla de estadisticas
        Dictionary<string, dynamic> peorEquipo = null;
        int peorPuntaje = int.MaxValue;
        foreach (Dictionary<string, dynamic> i in lista)
        {
            if (i["P Virtual"] < peorPuntaje)
            {
                peorPuntaje = i["P Virtual"];
                peorEquipo = i;
            }
        }
        Console.WriteLine($"El pais con menor probabilidad de estar en la final del Mundial 2014 es {peorEquipo["nombre"]}, con un puntaje de {peorPuntaje}.");
    }

    public static void Main(string[] args)
    {
        LeerArchivo("estadisticas.txt", ref listaEquipos);
        var estadisticas = CrearLista(listaEquipos);
        EscribirLista(estadisticas);
        ImprimirPeorEquipo(estadisticas);
    }
}