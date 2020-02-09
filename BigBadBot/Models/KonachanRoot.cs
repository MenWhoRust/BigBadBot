using System;
using System.Xml.Serialization;

namespace BigBadBot.Models
{
    [XmlRoot("posts")]
    public class KonachanRoot
    {
        [XmlAttribute("count")]
        public int Count { get; set; }

        [XmlAttribute("offset")]
        public int Offset { get; set; }

        [XmlElement("post")]
        public KonachanPost KonachanPost { get; set; }


    }


}
